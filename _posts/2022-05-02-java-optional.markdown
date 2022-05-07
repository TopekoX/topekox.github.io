---
title:  "Menangani NullPointer Exception dengan Java Optional"   
defaults:
  # _posts
  - scope:
      path: ""
      type: posts
      categories: artikel
    values:
      layout: single
      author_profile: true
      read_time: true
      comments: true
      share: true
      related: true
      show_date: true
toc: true
toc_label: "Daftar Isi Artikel ini"
toc_icon: "file-alt"
---

Bagi programmer Java sudah wajib hukumnya untuk selalu bertemu dengan `NullPointerException`, dan ini sebenarnya membuat crash program kita, dan yang jelas kita harus sedikit garuk kepala untuk menangani exception ini. Cara yang paling populer adalah diakali dengan statement kondisi `if else`. Untuk menangani ini, Java versi 8 mengenalkan fitur baru yaitu class baru bernama `Optional` yang berada pada package `java.util`. Class ini sangat membantu sekali untuk menangani `null` tanpa harus dicek terlebih dahulu dengan statement kondisi `if else`. 

<!--truncate-->

Berikut contoh program yang menghasilkan `NullPointerException` :

```java
public class DemoOptional {

    public static void main(String[] args) {
        
        String[] students = new String[20];
	    String john = students[10].toUpperCase();

        System.out.println("Name : " + john);        
    }
}
```

Sekilas program ini tidak ada yang salah, ketika dicompile program ini tidak akan mengalami pesan error, tetapi ketika dieksekusi program ini akan menghasilkan error dikarenakan variable `john` yang dipanggil masih belum ada nilainya alias `null`.

Ketika program ini di jalankan/run maka akan menghasilkan exception `NullPointerException`, karena memang array students index 10 masih bernilai `null`.

```bash
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.toUpperCase()" because "<local1>[10]" is null
	at DemoOptional.main(DemoOptional.java:6)
```

Nah untuk mengatasinya biasanya dibuatkan statement pemilihan `if else` untuk menghandle exception tersebut misalnya seperti di bawah ini:

```java
String[] students = new String[20];

// cek nilai apakah null
if (students[10] == null) {
    students[10] = "John Doe";
}

String john = students[10].toUpperCase();

System.out.println("Name : " + john);
```

Output:

```bash
Name : JOHN DOE
```

Contoh penggunaan `if` seperti contoh di atas tidaklah salah, tetapi karena seringnya programmer Java mendapatkan permasalahan seperti contoh di atas maka Java 8 membuatkan solusi lain menggunakan class `Optional`. Contoh program di atas dapat disederhanakan menggunakan class Optional seperti contoh sebagai berikut:

```java
import java.util.Optional;

public class DemoOptional {
    public static void main(String[] args) {
        String[] students = new String[20];

        String john = Optional.ofNullable(students[10])
                .orElse("John Doe").toUpperCase();

        System.out.println("Name : " + john);
    }
}
```

Output yang dihasilkan akan sama dengan program sebelumnya tetapi cara yang digunakan sedikit berbeda karena menggunakan class `Optional` untuk memeriksa nilai dari `student[10]` yang langsung memberikan nilai ketika bernilai Nullable.

Beberapa contoh penggunaan Optional.

**Info :** Yang berada dalam blok komentar adalah cara manual.
{: .notice--info}

## Check Null

```java
//        String name = customer.getName();
//        if (name == null) {
//            name = "";
//        }
    
 String name = Optional.ofNullable(customer.getName())
                .orElse("");
```

## if Logic

```java
//        Customer customer = repository.findById("id");
//        if (customer == null) {
//            customer = repository.createNew();
//        }

String nameUpper = Optional.ofNullable(customer.getName())
                .map(value -> value.toUpperCase())
                .orElse("");
```

## Operation if Not Null

```java
//                int id = 2;
//                Person person = session.get(Person.class, id);
//                if (person != null) {
//                  System.out.println("Deleting");
//                  session.delete(aktor);
//                }

int id = 2;
Optional<Person> person = Optional.ofNullable(session.get(Person.class, id));
person.ifPresent(value -> session.delete(value));
```

## Operation to Null Value

```java
//        String nameUpper = customer.getName();
//        if (nameUpper != null) {
//            nameUpper = nameUpper.toUpperCase();
//        } else {
//            nameUpper = "";
//        }

String nameUpper = Optional.ofNullable(customer.getName())
                .map(value -> value.toUpperCase())
                .orElse("");
```

## nested If Checking

```java
//        String country = "Indonesia";
//        if (customer.getAddress() != null) {
//            if (customer.getAddress().getCountry() != null) {
//                country = customer.getAddress().getCountry();
//            }
//        }

String country = Optional.ofNullable(customer.getAddress())
                .map(address -> address.getCountry())
                .orElse("Indonesia");

```

## Check and Throw Exception

```java
//        String name = customer.getName();
//        if (name == null) {
//            throw new IllegalArgumentException("Name is null");
//        }

String name = Optional.ofNullable(customer.getName())
                .orElseThrow(() -> new IllegalArgumentException("Name is null"));
```

## if Check Do Something

```java
//        if (customer.getAddress() != null) {
//            if (customer.getAddress().getCountry() != null) {
//                System.out.println(customer.getAddress().getCountry());
//            }
//        }

Optional.ofNullable(customer.getAddress())
                .map(address -> address.getCountry())
                .ifPresent(country -> System.out.println(country));

```

## neested Object

```java
//        Long cashBalance = 0L;
//        if (customer.getWallet() != null) {
//            if (customer.getWallet().getBalance() != null) {
//                cashBalance = customer.getWallet().getBalance().getCashBalance();
//            }
//        }

Long cashBalance = Optional.ofNullable(customer.getWallet())
                .map(wallet -> wallet.getBalance())
                .map(balance -> balance.getCashBalance())
                .orElse(0L);
```

## Filter

```java
//        Long bonus = 0L;
//        if (CustomerType.PLATINUM.equals(customer.getType())) {
//            if (customer.getWallet() != null) {
//                if (customer.getWallet().getBalance() != null) {
//                    bonus = customer.getWallet().getBalance().getCashBalance() * 10 / 100;
//                }
//            }
//        }

Long bonus = Optional.ofNullable(customer)
                .filter(value -> CustomerType.PLATINUM.equals(customer.getType()))
                .map(value -> value.getWallet())
                .map(wallet -> wallet.getBalance())
                .map(balance -> balance.getCashBalance())
                .map(cashBalance -> cashBalance * 10 / 100)
                .orElse(0L);
```

**Download** [Source Code](https://github.com/TopekoX/java-optional-demo)
{: .notice--success}

**Referensi** :
* [https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html](https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html)
* [https://www.youtube.com/watch?v=mucDS5Db9go](https://www.youtube.com/watch?v=mucDS5Db9go)
